const Tariffs = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Tariff Management</h1>
            <p className="text-neutral-400 text-lg">
                Configure and update electricity tariff plans and rates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                        <div className="h-6 w-32 bg-indigo-600/20 rounded-full mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-neutral-800 rounded"></div>
                            <div className="h-2 w-2/3 bg-neutral-800 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tariffs;
