/**
 * Main export function to handle both Web and Native environments
 */
async function exportData() {
    try {
        // Use the Storage key from your app logic
        const data = localStorage.getItem('bullion_plus_data'); // Ensure this matches Storage.KEY
        
        if (!data) {
            alert("No data to export");
            return;
        }

        // Detect Capacitor Native environment
        if (window.Capacitor && Capacitor.isNativePlatform()) {
            await saveToNativeDevice(data);
        } else {
            downloadToWeb(data);
        }

    } catch (error) {
        console.error("Export failed:", error);
        alert(`Export failed: ${error.message}`);
    }
}

/**
 * Native Device Save: Uses Capacitor Filesystem and Share plugins
 */
async function saveToNativeDevice(data) {
    try {
        // Access plugins from the global Capacitor object
        const { Filesystem } = Capacitor.Plugins;
        const { Share } = Capacitor.Plugins;

        const timestamp = new Date().toISOString().slice(0, 10);
        const fileName = `bullion_pro_backup_${timestamp}.json`;

        // 1. Write the file to the Cache directory 
        // We use CACHE because it's easier for the Share plugin to access without extra permissions
        const result = await Filesystem.writeFile({
            path: fileName,
            data: data,
            directory: 'CACHE', 
            encoding: 'utf8' 
        });

        // 2. Open the Native Share Sheet
        // This allows the user to send the backup to Google Drive, WhatsApp, or Email
        await Share.share({
            title: 'Bullion Pro Backup',
            text: 'Here is your Bullion Plus data backup file.',
            url: result.uri,
            dialogTitle: 'Save or Send Backup'
        });

    } catch (e) {
        console.error("Native Save Error", e);
        alert("Native Export Error: " + e.message);
    }
}

/**
 * Web Browser Download: Standard Blob approach
 */
function downloadToWeb(data) {
    const timestamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bullion_pro_backup_${timestamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
