//
//  AnimeViewModel.swift
//  animeyourself
//
//  Created by Julian Beck on 30.03.25.
//



import Foundation
import SwiftUI
import os.log


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
    
    private let serverURL = "https://anime-transformer.app.juli.sh/api/transform"
    
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
        selectedStyle = style
        
        Task {
            do {
                let processedImg = try await transformToAnime(from: image, styleName: style)
                self.processedImage = processedImg
                self.showConfetti = true // Trigger confetti when successful
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
    }
    
    private func transformToAnime(from image: UIImage, styleName: String) async throws -> UIImage {
        guard let imageData = image.jpegData(compressionQuality: 0.8) else {
            throw NSError(domain: "AnimeYourself", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to convert image to data"])
        }
        
        // Convert UIImage to base64 string
        let base64String = imageData.base64EncodedString()
        
        // Get the style ID from the style name
        let styleID = styleIDs[styleName] ?? "anime-default-001"
        
        // Get RevenueCat user ID from UserDefaults or any other source you're using
        let revenueCatUserID = UserDefaults.standard.string(forKey: "revenueCatUserID") ?? "anonymous"
        
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
        guard let url = URL(string: serverURL) else {
            throw NSError(domain: "AnimeYourself", code: 3, userInfo: [NSLocalizedDescriptionKey: "Invalid URL"])
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Send request
        let (data, response) = try await URLSession.shared.data(for: request)
        
        // Check response status
        guard let httpResponse = response as? HTTPURLResponse, httpResponse.statusCode == 200 else {
            let statusCode = (response as? HTTPURLResponse)?.statusCode ?? 0
            let errorMessage = String(data: data, encoding: .utf8) ?? "Unknown error"
            throw NSError(domain: "AnimeYourself", code: 4, userInfo: [
                NSLocalizedDescriptionKey: "Server returned error: \(statusCode)",
                "serverResponse": errorMessage
            ])
        }
        
        // Create UIImage from response data
        guard let processedImage = UIImage(data: data) else {
            Plausible.shared.trackEvent(event: "anime_transform_failed", path: "/transform/error")
            throw NSError(domain: "AnimeYourself", code: 5, userInfo: [NSLocalizedDescriptionKey: "Failed to create image from response data"])
        }
        
        Plausible.shared.trackEvent(event: "anime_transform_success", path: "/transform/success", properties: ["style": styleID])
        
        return processedImage
    }
}
