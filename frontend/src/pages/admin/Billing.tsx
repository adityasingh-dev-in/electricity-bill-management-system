const Billing = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Billing System</h1>
            <p className="text-neutral-400 text-lg">
                Generate and review consumer utility bills.
            </p>
            <div className="p-8 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <div className="flex items-center justify-between mb-8">
                    <div className="h-10 w-48 bg-neutral-800 rounded-lg"></div>
                    <div className="h-10 w-32 bg-indigo-600 rounded-lg"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-12 w-full bg-neutral-800/50 rounded-xl"></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Billing;
