#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    Manager,
    menu::{MenuBuilder, MenuItemBuilder},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton},
};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
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
                .item(&MenuItemBuilder::new("Abrir SubmIT").id("show").build(app)?)
                .separator()
                .item(&MenuItemBuilder::new("Sair").id("quit").build(app)?)
                .build()?;

            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&tray_menu)
                .on_menu_event({
                    let app_handle = app_handle.clone();
                    move |_tray, event| match event.id().as_ref() {
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
                })
                .on_tray_icon_event({
                    let app_handle = app_handle.clone();
                    move |_tray, event| {
                        match event {
                            TrayIconEvent::Click { button: MouseButton::Left, .. } => {
                                if let Some(win) = app_handle.get_webview_window("main") {
                                    if win.is_visible().unwrap() {
                                        win.hide().unwrap();
                                    } else {
                                        win.show().unwrap();
                                        win.set_focus().unwrap();
                                    }
                                }
                            }

                            TrayIconEvent::Click { button: MouseButton::Right, .. } => {
                            }

                            _ => {}
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri app");
}
