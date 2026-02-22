async function exportData() {
    try {
        const data = localStorage.getItem(Storage.KEY);
        
        if (!data) {
            alert("No data to export");
            return;
        }

        // Check if running on web or native
        if (window.cordova || window.capacitor) {
            // Native app - save to device
            await saveToNativeDevice(data);
        } else {
            // Web - download to browser
            downloadToWeb(data);
        }

    } catch (error) {
        console.error("Export failed:", error);
        alert(`Export failed: ${error.message}`);
    }
}

async function saveToNativeDevice(data) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const timestamp = new Date().toISOString().slice(0, 10);
    
    await Filesystem.writeFile({
        path: `bullion_pro_backup_${timestamp}.json`,
        data: data,
        directory: Directory.Documents,
        recursive: true,
    });
    
    alert("Backup saved to Documents");
}

function downloadToWeb(data) {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bullion_pro_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
}
