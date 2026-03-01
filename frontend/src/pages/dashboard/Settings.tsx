const Settings = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Settings</h1>
            <p className="text-neutral-400 text-lg">
                Global configuration and administration preferences.
            </p>
            <div className="max-w-2xl space-y-8">
                {[1, 2, 3].map((section) => (
                    <div key={section} className="space-y-4">
                        <div className="h-4 w-32 bg-neutral-800 rounded"></div>
                        <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-2 w-48 bg-neutral-800 rounded"></div>
                                <div className="h-6 w-10 bg-indigo-600 rounded-full"></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="h-2 w-32 bg-neutral-800 rounded"></div>
                                <div className="h-6 w-10 bg-neutral-800 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
