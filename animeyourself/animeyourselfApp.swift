//
//  animeyourselfApp.swift
//  animeyourself
//
//  Created by Julian Beck on 30.03.25.
//

import SwiftUI
import RevenueCat

@main
struct animeyourselfApp: App {
    @StateObject var globalViewModel = GlobalViewModel()
    @StateObject var wmrm = AnimeViewModel()
    
    init() {
        Purchases.configure(withAPIKey: "appl_xIhJySLYOoywhePdUmVaSAnaZLj")
    }
    
    var body: some Scene {
        WindowGroup {
            MainView()
                .environmentObject(globalViewModel)
                .environmentObject(wmrm)
                
                .onAppear {
                    Plausible.shared.configure(domain: "anime.juli.sh", endpoint: "https://stats.juli.sh/api/event")
                }
        }
    }
}
