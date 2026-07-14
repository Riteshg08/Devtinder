import { Link } from "react-router-dom";
import { useState } from "react";
import ProgressBar from "./ProgressBar";
import { X } from "lucide-react";

const SkillsStep = ({ formData, updateFormData, back, onFinish }) => {
    const mainSkills = [
        "React",
        "Node.js",
        "JavaScript",
        "Python",
        "TypeScript"
    ];

    const [customSkillInput, setCustomSkillInput] = useState("");

    const handleSkillClick = (skill) => {
        if (formData.skills.includes(skill)) {
            updateFormData(
                "skills",
                formData.skills.filter((item) => item !== skill)
            );
        } else {
            updateFormData("skills", [...formData.skills, skill]);
        }
    };

    const handleAddCustomSkill = () => {
        const trimmedSkill = customSkillInput.trim();

        if (trimmedSkill === "") return;

        if (formData.skills.includes(trimmedSkill)) {
            setCustomSkillInput("");
            return;
        }

        updateFormData("skills", [...formData.skills, trimmedSkill]);
        setCustomSkillInput("");
    };

    return (
        <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="logo-icon w-10 h-10">{"</>"}</div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">DevTinder</h1>
            </div>

            <ProgressBar step={3} />

            <div className="w-full max-w-4xl card p-5 sm:p-8 mt-4 shadow-xl shadow-black/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Select your skills
                </h2>
                <p className="text-gray-400 text-sm sm:text-base mt-2">
                    Choose the technologies you're comfortable working with.
                </p>

                <div className="flex flex-wrap gap-2 sm:gap-3 mt-6">
                    {mainSkills.map((skill) => (
                        <button
                            key={skill}
                            onClick={() => handleSkillClick(skill)}
                            className={`px-4 py-2 rounded-full border text-sm transition-all duration-200 ${
                                formData.skills.includes(skill)
                                    ? "bg-violet-600 border-violet-500 text-white"
                                    : "bg-surface-elevated border-border text-gray-300 hover:border-violet-500/50"
                            }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>

                <div className="mt-6">
                    <label className="block text-gray-300 text-sm mb-1.5">Add another skill</label>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            placeholder="e.g. GraphQL"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddCustomSkill();
                                }
                            }}
                            className="input-field flex-1"
                        />
                        <button
                            onClick={handleAddCustomSkill}
                            className="btn-secondary px-5 shrink-0"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {formData.skills.length > 0 && (
                    <div className="mt-6">
                        <p className="text-gray-400 text-sm mb-2">
                            Your skills ({formData.skills.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/20 border border-violet-500/30 text-white text-sm"
                                >
                                    {skill}
                                    <button
                                        onClick={() => handleSkillClick(skill)}
                                        className="text-white/60 hover:text-white transition-colors"
                                        aria-label={`Remove ${skill}`}
                                    >
                                        <X size={14} />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button onClick={back} className="btn-secondary flex-1 py-3">
                        Back
                    </button>
                    <button onClick={onFinish} className="btn-primary flex-1 py-3">
                        Complete Profile →
                    </button>
                </div>
            </div>

            <p className="text-gray-400 text-sm mt-6 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-violet-400 hover:underline font-medium">
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SkillsStep;
