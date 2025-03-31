//
//  ResultView.swift
//  animeyourself
//
//  Created by Julian Beck on 30.03.25.
//

import SwiftUI
import ConfettiSwiftUI

struct ResultView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.presentationMode) private var presentationMode
    @EnvironmentObject private var model: AnimeViewModel
    @EnvironmentObject private var globalViewModel: GlobalViewModel
    
    @State private var showShareSheet = false
    @State private var confettiTrigger = 0
    @State private var rippleCounter = 0
    @State private var rippleOrigin: CGPoint = .zero
    @State private var timer: Timer? = nil
    @State private var viewBounds: CGRect = .zero
    @State private var retryCount = 0
    
    var body: some View {
        ZStack {
            // Background gradient
            LinearGradient(
                gradient: Gradient(colors: [
                    Color.black,
                    Color.black.opacity(0.9),
                    Color.accentColor.opacity(0.7)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 20) {
                // Header
                HStack {
                    Button {
                        // Use proper navigation back for navigation stack
                        presentationMode.wrappedValue.dismiss()
                    } label: {
                        Image(systemName: "chevron.left.circle.fill")
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .disabled(model.isProcessing)
                    .opacity(model.isProcessing ? 0.5 : 1)
                    
                    Spacer()
                    
                    Text("Anime Portrait")
                        .font(.system(.title, design: .rounded, weight: .bold))
                        .foregroundColor(.white)
                    
                    Spacer()
                    
                    Button {
                        if retryCount < 3 {
                            retryCount += 1
                            
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                if !globalViewModel.isPro {
                                    globalViewModel.isShowingPayWall = true
                                }
                            }
                            
                            if let image = model.selectedImage {
                                model.processImage(image, style: model.selectedStyle)
                            }
                        }
                    } label: {
                        Image(systemName: "arrow.clockwise.circle.fill")
                            .font(.system(size: 24, weight: .semibold))
                            .foregroundColor(.white)
                    }
                    .disabled(model.isProcessing || model.selectedImage == nil || retryCount >= 3)
                    .opacity((model.isProcessing || model.selectedImage == nil || retryCount >= 3) ? 0.5 : 1)
                }
                .padding(.horizontal)
                .padding(.top, 20)
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Processing State
                        if model.isProcessing {
                            if let originalImage = model.selectedImage {
                                // Show ripple effect on original image during processing
                                ZStack {
                                    Image(uiImage: originalImage)
                                        .resizable()
                                        .scaledToFit()
                                        .cornerRadius(16)
                                        .modifier(RippleEffect(at: rippleOrigin, trigger: rippleCounter))
                                        .animation(.easeInOut(duration: 2).repeatForever(autoreverses: true), value: model.isProcessing)
                                        .background(GeometryReader { geometry in
                                            Color.clear
                                                .onAppear {
                                                    // Store bounds for random ripple generation
                                                    viewBounds = geometry.frame(in: .local)
                                                    startRippleEffect()
                                                }
                                        })
                                    
                                    // Loading spinner with status
                                    VStack {
                                        ProgressView()
                                            .scaleEffect(2)
                                            .tint(.white)
                                        
                                        Text(getStatusText(status: model.processingStatus))
                                            .font(.system(.headline, design: .rounded))
                                            .foregroundColor(.white)
                                            .padding(.top, 20)
                                    }
                                    .padding(30)
                                    .background(.ultraThinMaterial)
                                    .cornerRadius(20)
                                    .shadow(radius: 10)
                                    .frame(maxWidth: 280)
                                }
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color.white.opacity(0.2), lineWidth: 1.5)
                                )
                                .frame(width: UIScreen.main.bounds.width * 0.8) // Set width to 80% of screen width
                                .frame(maxHeight: UIScreen.main.bounds.height * 0.7)
                                .preferredColorScheme(.dark)
                                
                            } else {
                                ProgressView()
                                    .scaleEffect(2)
                                    .tint(.white)
                            }
                        }
                        // Result State
                        else if let processedImage = model.processedImage {
                            ZStack {
                                
                                Image(uiImage: processedImage)
                                    .resizable()
                                    .cornerRadius(16)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16)
                                            .stroke(Color.white.opacity(0.4), lineWidth: 1)
                                    )
                                    .scaledToFit()
                                    .frame(maxWidth: .infinity)
                                    .frame(maxHeight: 400)
                                    .shadow(radius: 10, x: 0, y: 5)
                            }
                            .confettiCannon(
                                trigger: $confettiTrigger,
                                num: 50,
                                confettis: [.shape(.circle), .shape(.triangle), .shape(.square)],
                                colors: [.blue, .green, .red, .yellow, .purple],
                                openingAngle: Angle(degrees: 60),
                                closingAngle: Angle(degrees: 120),
                                radius: 200
                            )
                            .onAppear {
                                if model.showConfetti {
                                    confettiTrigger += 1
                                    model.showConfetti = false
                                }
                            }
                            .onChange(of: model.showConfetti) { newValue in
                                if newValue {
                                    confettiTrigger += 1
                                    model.showConfetti = false
                                }
                            }
                            
                            // Style badge
                            Text(model.selectedStyle)
                                .font(.system(.subheadline, design: .rounded, weight: .medium))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(
                                    Capsule()
                                        .fill(.ultraThinMaterial)
                                )
                                .overlay(
                                    Capsule()
                                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                )
                                .foregroundColor(.white)
                            
                            // Action buttons
                            HStack(spacing: 15) {
                                ActionButton(
                                    title: "Save",
                                    icon: "square.and.arrow.down",
                                    backgroundColor: Color.accentColor
                                ) {
                                    saveImageToPhotoLibrary(processedImage)
                                }
                                
                                ActionButton(
                                    title: "Share",
                                    icon: "square.and.arrow.up",
                                    backgroundColor: Color.black.opacity(0.4),
                                    action:  {
                                        showShareSheet = true
                                    }, showBorder: true)
                            }
                            
                            // Try another style button
                            Button {
                                presentationMode.wrappedValue.dismiss()
                            } label: {
                                HStack {
                                    Image(systemName: "paintpalette")
                                        .font(.system(size: 18))
                                    Text("Try Another Style")
                                        .font(.system(.body, design: .rounded, weight: .medium))
                                }
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
                                .background(
                                    RoundedRectangle(cornerRadius: 25)
                                        .fill(Color.purple.opacity(0.7))
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 25)
                                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                                        )
                                )
                                .foregroundColor(.white)
                            }
                            .shadow(radius: 4, x: 0, y: 2)
                            .padding(.top, 8)
                        }
                        // Error State
                        else if let errorMessage = model.errorMessage {
                            VStack(spacing: 20) {
                                if let originalImage = model.selectedImage {
                                    Image(uiImage: originalImage)
                                        .resizable()
                                        .scaledToFit()
                                        .cornerRadius(16)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 16)
                                                .stroke(Color.red.opacity(0.5), lineWidth: 1.5)
                                        )
                                        .frame(maxWidth: UIScreen.main.bounds.width * 0.8)
                                        .frame(maxHeight: UIScreen.main.bounds.height * 0.5)
                                }

                                VStack(spacing: 16) {
                                    Image(systemName: "exclamationmark.circle.fill")
                                        .font(.system(size: 40))
                                        .foregroundColor(.red)
                                    
                                    Text("Generation Failed")
                                        .font(.system(.title3, design: .rounded, weight: .bold))
                                        .foregroundColor(.white)
                                    
                                    Text(errorMessage)
                                        .font(.system(.body, design: .rounded))
                                        .multilineTextAlignment(.center)
                                        .foregroundColor(.white.opacity(0.8))
                                        .padding(.horizontal)
                                }
                                .padding()
                                .background(.ultraThinMaterial)
                                .cornerRadius(16)
                                
                                HStack(spacing: 16) {
                                    Button {
                                        if retryCount < 3 {
                                            retryCount += 1
                                            model.errorMessage = nil
                                            
                                            DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
                                                if !globalViewModel.isPro {
                                                    globalViewModel.isShowingPayWall = true
                                                }
                                            }
                                            
                                            if let image = model.selectedImage {
                                                model.processImage(image, style: model.selectedStyle)
                                            }
                                        }
                                    } label: {
                                        HStack {
                                            Image(systemName: "arrow.clockwise")
                                            Text(retryCount >= 3 ? "Retry Limit Reached" : "Free Retry")
                                        }
                                        .font(.system(.body, design: .rounded, weight: .medium))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 16)
                                        .background(
                                            RoundedRectangle(cornerRadius: 25)
                                                .fill(retryCount >= 3 ? Color.gray : Color.purple)
                                        )
                                        .foregroundColor(.white)
                                    }
                                    .disabled(retryCount >= 3)
                                    
                                    Button {
                                        model.clearImages()
                                        presentationMode.wrappedValue.dismiss()
                                    } label: {
                                        HStack {
                                            Image(systemName: "arrow.triangle.2.circlepath")
                                            Text("Start Over")
                                        }
                                        .font(.system(.body, design: .rounded, weight: .medium))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 16)
                                        .background(
                                            RoundedRectangle(cornerRadius: 25)
                                                .fill(Color.gray.opacity(0.3))
                                        )
                                        .foregroundColor(.white)
                                    }
                                }
                            }
                            .padding(24)
                            .frame(maxWidth: .infinity)
                            .background(
                                RoundedRectangle(cornerRadius: 16)
                                    .fill(Color.black.opacity(0.95))
                            )
                            .padding()
                        }
                    }
                    .padding()
                }
                
                Spacer()
            }
        }
        .sheet(isPresented: $showShareSheet) {
            if let image = model.processedImage {
                ShareSheet(items: [image])
            }
        }
        .navigationBarBackButtonHidden(true)
        .onAppear {
            // Start the ripple effect if we're processing
            if model.isProcessing {
                startRippleEffect()
            }
        }
        .onDisappear {
            // Clean up the timer when view disappears
            timer?.invalidate()
            timer = nil
        }
    }
    
    // Function to create ripples at random positions
    private func startRippleEffect() {
        // Cancel any existing timer
        timer?.invalidate()
        
        // Create a new timer that triggers ripples randomly
        timer = Timer.scheduledTimer(withTimeInterval: 1.5, repeats: true) { _ in
            // Only generate ripples if we have valid bounds and are processing
            if !viewBounds.isEmpty && model.isProcessing {
                // Generate random position within the view bounds
                let randomX = CGFloat.random(in: viewBounds.minX...viewBounds.maxX)
                let randomY = CGFloat.random(in: viewBounds.minY...viewBounds.maxY)
                
                // Update origin and counter to trigger new ripple
                rippleOrigin = CGPoint(x: randomX, y: randomY)
                rippleCounter += 1
                
                // Play haptic feedback for each ripple
                let generator = UIImpactFeedbackGenerator(style: .light)
                generator.impactOccurred()
            }
        }
    }
    
    private func saveImageToPhotoLibrary(_ image: UIImage) {
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
    }
    
    // Function to get user-friendly status text
    private func getStatusText(status: String) -> String {
        switch status {
        case "queued":
            return "Your image is in queue..."
        case "processing":
            return "Creating anime portrait..."
        case "completed":
            return "Completed! Finishing up..."
        case "failed":
            return "Generation failed. Please try again."
        default:
            return "Creating anime portrait..."
        }
    }
}


struct ActionButton: View {
    let title: String
    let icon: String
    let backgroundColor: Color
    let action: () -> Void
    var showBorder: Bool = false
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 18, weight: .medium))
                    .frame(width: 24, height: 24)
                Text(title)
                    .font(.system(.body, design: .rounded, weight: .bold))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(
                RoundedRectangle(cornerRadius: 25)
                    .fill(backgroundColor)
                    .overlay(
                        showBorder ?
                        RoundedRectangle(cornerRadius: 25)
                            .stroke(Color.white.opacity(0.5), lineWidth: 1.5)
                        : nil
                    )
            )
            .foregroundColor(.white)
            .shadow(radius: 4, x: 0, y: 2)
        }
        .frame(height: 56) // Fixed height for all buttons
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    var items: [Any]
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
        let controller = UIActivityViewController(activityItems: items, applicationActivities: nil)
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}

#Preview {
    ResultView()
        .environmentObject(AnimeViewModel())
}
