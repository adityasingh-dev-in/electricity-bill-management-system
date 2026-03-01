const Payments = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Payment History</h1>
            <p className="text-neutral-400 text-lg">
                Track payments and manage transactions.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl h-80"></div>
                <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl h-80"></div>
            </div>
        </div>
    );
};

export default Payments;
