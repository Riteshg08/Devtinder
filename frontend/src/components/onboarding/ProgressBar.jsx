const ProgressBar = ({ step }) => {
    return (
        <div className="flex justify-center gap-2 sm:gap-3 mb-4">
            {[1, 2, 3].map((item) => (
                <div
                    key={item}
                    className={`h-1.5 w-14 sm:w-20 md:w-24 rounded-full transition-colors duration-300 ${
                        item <= step ? "bg-violet-500" : "bg-border"
                    }`}
                />
            ))}
        </div>
    );
};

export default ProgressBar;
