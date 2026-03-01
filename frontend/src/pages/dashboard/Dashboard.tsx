const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-neutral-400 text-lg">
                Welcome back! Here's an overview of the system performance and status.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse">
                        <div className="h-4 w-24 bg-neutral-800 rounded mb-4"></div>
                        <div className="h-8 w-16 bg-neutral-800 rounded"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
