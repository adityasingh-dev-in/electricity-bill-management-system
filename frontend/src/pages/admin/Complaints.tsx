const Complaints = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Complaints & Support</h1>
            <p className="text-neutral-400 text-lg">
                Address consumer grievances and support requests.
            </p>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl flex gap-6">
                        <div className="h-12 w-12 rounded-full bg-neutral-800 shrink-0"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 w-40 bg-neutral-800 rounded"></div>
                            <div className="h-2 w-full bg-neutral-800/50 rounded"></div>
                            <div className="h-2 w-2/3 bg-neutral-800/50 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Complaints;
