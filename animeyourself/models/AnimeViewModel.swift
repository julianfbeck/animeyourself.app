//
//  AnimeViewModel.swift
//  animeyourself
//
//  Created by Julian Beck on 30.03.25.
//



import Foundation
import SwiftUI
import os.log
import RevenueCat


@MainActor
class AnimeViewModel: ObservableObject {
    @Published var selectedImage: UIImage?
    @Published var processedImage: UIImage?
    @Published var isProcessing = false
    @Published var errorMessage: String?
    @Published var showResultView = false
    @Published var showConfetti = false
    @Published var navigateToResult = false
    @Published var selectedStyle: String = "anime-default"
    @Published var processingStatus: String = "queued"
    @Published var requestId: String?
    
    private let newRequestEndpoint = "https://animeyourselfworker.beanvault.workers.dev/v1/new"
    private let statusEndpointBase = "https://animeyourselfworker.beanvault.workers.dev/v1/status/"
    
    private let logger = Logger(
        subsystem: Bundle.main.bundleIdentifier ?? "com.julianbeck.animeyourself",
        category: "AnimeViewModel"
    )
    
    // Dictionary mapping style names to style IDs
    private let styleIDs: [String: String] = [
        "Anime Default": "anime-default-001",
        "Studio Ghibli": "ghibli-inspired-002",
        "Cyberpunk Anime": "cyberpunk-anime-003",
        "Chibi Style": "chibi-kawaii-004",
        "Shonen Action": "shonen-dynamic-005",
        "Shoujo Romance": "shoujo-soft-006",
        "One Piece Style": "onepiece-007",
        "Dragon Ball Z": "dragonball-008",
        "Naruto Style": "naruto-009",
        "Attack on Titan": "titan-dark-010"
    ]
    
    func processImage(_ image: UIImage, style: String) {
        isProcessing = true
        errorMessage = nil
        showConfetti = false
        processingStatus = "queued"
        selectedStyle = style
        
        Task {
            do {
                // Start the transformation process
                let reqId = try await initiateTransformation(from: image, styleName: style)
                self.requestId = reqId
                
                // Monitor status until completion or timeout
                try await monitorTransformationStatus(requestId: reqId)
                
                self.logger.info("Image transformed to anime successfully with style: \(style)")
            } catch {
                self.errorMessage = "Failed to transform image: \(error.localizedDescription)"
                self.logger.error("Failed to transform image: \(error.localizedDescription)")
            }
            self.isProcessing = false
        }
    }
    
    func clearImages() {
        selectedImage = nil
        processedImage = nil
        errorMessage = nil
        showResultView = false
        navigateToResult = false
        isProcessing = false
        showConfetti = false
        processingStatus = "queued"
        requestId = nil
    }
    
    private func initiateTransformation(from image: UIImage, styleName: String) async throws -> String {
        print("Starting transformation with style: \(styleName)")
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw NSError(domain: "AnimeYourself", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert image to data"])
        }
        
        // Convert UIImage to base64 string
        let base64String = imageData.base64EncodedString()
        
        // Get the style ID from the style name
        let styleID = styleIDs[styleName] ?? "anime-default-001"
        
        // Get RevenueCat user ID
        let revenueCatUserID = Purchases.shared.appUserID
        
        // Create request body
        let requestBody: [String: Any] = [
            "image": [
                "data": base64String,
                "mime_type": "image/jpeg"
            ],
            "styleID": styleID,
            "userID": revenueCatUserID
        ]
        
        // Convert request body to JSON data
        guard let jsonData = try? JSONSerialization.data(withJSONObject: requestBody) else {
            throw NSError(domain: "AnimeYourself", code: 2, userInfo: [NSLocalizedDescriptionKey: "Failed to serialize request"])
        }
        
        // Create URL request
        guard let url = URL(string: newRequestEndpoint) else {
            throw NSError(domain: "AnimeYourself", code: 3, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Send request
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Check response status
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NSError(domain: "AnimeYourself", code: 4, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])
        }
        
        switch httpResponse.statusCode {
        case 200, 201, 202:
            // Parse the response to get the request ID
            guard let responseDict = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                  let success = responseDict["success"] as? Bool,
                  success,
                  let requestId = responseDict["requestId"] as? String else {
                throw NSError(domain: "AnimeYourself", code: 5, userInfo: [NSLocalizedDescriptionKey: "Invalid response format"])
            }
            
            self.processingStatus = responseDict["state"] as? String ?? "queued"
            return requestId
            
        case 429:
            // Rate limit exceeded
            throw NSError(domain: "AnimeYourself", code: 6, userInfo: [NSLocalizedDescriptionKey: "Rate limit exceeded. Please try again later."])
            
        default:
            // Other errors
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NSError(domain: "AnimeYourself", code: 7, userInfo: [
                NSLocalizedDescriptionKey: "Server returned error: \(httpResponse.statusCode)",
                "serverResponse": errorMessage
            ])
        }
    }
    
    private func monitorTransformationStatus(requestId: String) async throws {
        guard let statusUrl = URL(string: "\(statusEndpointBase)\(requestId)") else {
            throw NSError(domain: "AnimeYourself", code: 8, userInfo: [NSLocalizedDescriptionKey: "Invalid status URL"])
        }
        
        // Poll for status every 3 seconds, timeout after 2 minutes (40 attempts)
        let maxAttempts = 40
        
        for attempt in 0..<maxAttempts {
            do {
                let (data, response) = try await URLSession.shared.data(from: statusUrl)
                
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw NSError(domain: "AnimeYourself", code: 9, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])
                }
                
                // Log the response for debugging
                if let responseString = String(data: data, encoding: .utf8) {
                    self.logger.debug("Status response (attempt \(attempt)): \(responseString)")
                }
                
                if httpResponse.statusCode == 200 {
                    // Parse the response
                    do {
                        // Try to parse as dictionary first
                        if let responseDict = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                            // Check for success flag
                            if let success = responseDict["success"] as? Bool, success {
                                // Check for data object
                                if let dataDict = responseDict["data"] as? [String: Any] {
                                    // Get status from data
                                    if let status = dataDict["status"] as? String {
                                        self.processingStatus = status
                                        self.logger.info("Processing status: \(status)")
                                        
                                        if status == "completed" {
                                            // If completed, check for image URL
                                            if let imageUrl = dataDict["url"] as? String {
                                                self.logger.info("Image URL found: \(imageUrl)")
                                                self.processedImage = try await fetchImageFromUrl(imageUrl: imageUrl)
                                                self.showConfetti = true
                                                Plausible.shared.trackEvent(event: "anime_transform_success", path: "/transform/success", properties: ["style": self.selectedStyle])
                                                return
                                            } else {
                                                // Try output field as fallback
                                                if let outputArray = dataDict["output"] as? [String], let imageUrl = outputArray.first {
                                                    self.logger.info("Image URL found in output array: \(imageUrl)")
                                                    self.processedImage = try await fetchImageFromUrl(imageUrl: imageUrl)
                                                    self.showConfetti = true
                                                    Plausible.shared.trackEvent(event: "anime_transform_success", path: "/transform/success", properties: ["style": self.selectedStyle])
                                                    return
                                                } else {
                                                    self.logger.error("No image URL found in response")
                                                    throw NSError(domain: "AnimeYourself", code: 10, userInfo: [NSLocalizedDescriptionKey: "Image URL not found in response"])
                                                }
                                            }
                                        }
                                    } else {
                                        self.logger.warning("Status field not found in data dictionary")
                                    }
                                } else if let state = responseDict["state"] as? String {
                                    // Fallback for old API format
                                    self.processingStatus = state
                                    self.logger.info("Using legacy state field: \(state)")
                                    
                                    if state == "completed" {
                                        self.processedImage = try await fetchCompletedImage(requestId: requestId)
                                        self.showConfetti = true
                                        Plausible.shared.trackEvent(event: "anime_transform_success", path: "/transform/success", properties: ["style": self.selectedStyle])
                                        return
                                    }
                                } else {
                                    self.logger.warning("No data object or state field found in response")
                                }
                            } else {
                                self.logger.warning("Success flag not found or false in response")
                            }
                        }
                    } catch {
                        self.logger.error("JSON parsing error: \(error.localizedDescription)")
                    }
                } else if httpResponse.statusCode == 404 {
                    // Request ID not found
                    throw NSError(domain: "AnimeYourself", code: 11, userInfo: [NSLocalizedDescriptionKey: "Request not found"])
                } else {
                    // Other error
                    let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
                    throw NSError(domain: "AnimeYourself", code: 12, userInfo: [NSLocalizedDescriptionKey: errorMessage])
                }
                
                // Wait for 3 seconds before checking again
                try await Task.sleep(nanoseconds: 3_000_000_000) // 3 seconds
            } catch {
                self.logger.error("Error during status check: \(error.localizedDescription)")
                throw error
            }
        }
        
        // If we've reached here, timeout occurred
        throw NSError(domain: "AnimeYourself", code: 13, userInfo: [NSLocalizedDescriptionKey: "Request timed out. Please try again."])
    }
    
    private func fetchImageFromUrl(imageUrl: String) async throws -> UIImage {
        guard let url = URL(string: imageUrl) else {
            throw NSError(domain: "AnimeYourself", code: 14, userInfo: [NSLocalizedDescriptionKey: "Invalid image URL"])
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NSError(domain: "AnimeYourself", code: 15, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])
        }
        
        if httpResponse.statusCode == 200 {
            guard let image = UIImage(data: data) else {
                Plausible.shared.trackEvent(event: "anime_transform_failed", path: "/transform/error")
                throw NSError(domain: "AnimeYourself", code: 16, userInfo: [NSLocalizedDescriptionKey: "Failed to create image from response data"])
            }
            return image
        } else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NSError(domain: "AnimeYourself", code: 17, userInfo: [NSLocalizedDescriptionKey: errorMessage])
        }
    }
    
    // Keep the original fetch function as fallback
    private func fetchCompletedImage(requestId: String) async throws -> UIImage {
        guard let statusUrl = URL(string: "\(statusEndpointBase)\(requestId)") else {
            throw NSError(domain: "AnimeYourself", code: 14, userInfo: [NSLocalizedDescriptionKey: "Invalid status URL"])
        }
        
        // For completeness, we need to make a GET request specifically for the processed image
        var request = URLRequest(url: statusUrl)
        request.httpMethod = "GET"
        request.setValue("image/png", forHTTPHeaderField: "Accept")
        
        let (data, response) = try await URLSession.shared.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NSError(domain: "AnimeYourself", code: 15, userInfo: [NSLocalizedDescriptionKey: "Invalid response"])
        }
        
        if httpResponse.statusCode == 200 {
            // Check if the response content type is an image
            let contentType = httpResponse.value(forHTTPHeaderField: "Content-Type") ?? ""
            if contentType.contains("image") {
                guard let image = UIImage(data: data) else {
                    Plausible.shared.trackEvent(event: "anime_transform_failed", path: "/transform/error")
                    throw NSError(domain: "AnimeYourself", code: 16, userInfo: [NSLocalizedDescriptionKey: "Failed to create image from response data"])
                }
                return image
            } else {
                // The response might be JSON, try to parse it to get the error message
                let errorMessage = String(data: data, encoding: .utf8) ?? "Failed to get processed image"
                throw NSError(domain: "AnimeYourself", code: 17, userInfo: [NSLocalizedDescriptionKey: errorMessage])
            }
        } else {
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NSError(domain: "AnimeYourself", code: 18, userInfo: [NSLocalizedDescriptionKey: errorMessage])
        }
    }
}
