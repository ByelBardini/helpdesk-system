#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{TrayIconBuilder, TrayIconEvent},
};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .setup(|app| {
            let app_handle = app.handle();

            if let Some(window) = app.get_webview_window("main") {
                let app_handle = app_handle.clone();
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        if let Some(win) = app_handle.get_webview_window("main") {
                            win.hide().unwrap();
                        }
                    }
                });
            }

            let tray_menu = MenuBuilder::new(app)
                .item(&MenuItemBuilder::new("Mostrar App").id("show").build(app)?)
                .item(&MenuItemBuilder::new("Sair").id("quit").build(app)?)
                .build()?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event({
                    let app_handle = app_handle.clone();
                    move |_tray, event| {
                        match event.id().as_ref() {
                            "show" => {
                                if let Some(win) = app_handle.get_webview_window("main") {
                                    win.show().unwrap();
                                    win.set_focus().unwrap();
                                }
                            }
                            "quit" => {
                                std::process::exit(0);
                            }
                            _ => {}
                        }
                    }
                })
                .on_tray_icon_event({
                    let app_handle = app_handle.clone();
                    move |_tray, event| {
                        if let TrayIconEvent::Click { .. } = event {
                            if let Some(win) = app_handle.get_webview_window("main") {
                                if win.is_visible().unwrap() {
                                    win.hide().unwrap();
                                } else {
                                    win.show().unwrap();
                                    win.set_focus().unwrap();
                                }
                            }
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .plugin(tauri_plugin_notification::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
