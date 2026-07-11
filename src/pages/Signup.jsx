import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import AccountStep from "../components/onboarding/AccountStep";
import RoleStep from "../components/onboarding/RoleStep";
import SkillsStep from "../components/onboarding/SkillsStep";

const Signup = () => {
  const navigate = useNavigate();

  // This is the ONE place that holds all the data collected
  // across all three steps. Each step just reads/writes into this.
  const [formData, setFormData] = useState({
    firstName: "",
    lastName:"",
    email: "",
    password: "",
    title: "",
    skills: []
  });

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");

  // Every step calls this to update its own piece of the shared data.
  // Example: updateFormData("email", "test@test.com")
  const updateFormData = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const goNext = () => {
    setStep(step + 1);
  };

  const goBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    console.log("Signup");
    try {
      setErrorMessage("");
      console.log("Signup");
      const response = await axios.post(
        BASE_URL + "/signup",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          title: formData.title,
          skills: formData.skills
        },
        {
          withCredentials: true // needed so the login cookie gets saved
        }
      );
      navigate("/edit-profile");
    } catch (err) {
      // axios puts the backend's error message in err.response.data
      const message =
        err.response && err.response.data
          ? err.response.data
          : "Something went wrong during signup";
      setErrorMessage(message);
    }
  };

  return (
    <div>
      {errorMessage && (
        <p className="text-red-400 text-center pt-4">{errorMessage}</p>
      )}

      {step === 1 && (
        <AccountStep
          formData={formData}
          updateFormData={updateFormData}
          next={goNext}
        />
      )}

      {step === 2 && (
        <RoleStep
          formData={formData}
          updateFormData={updateFormData}
          next={goNext}
          back={goBack}
        />
      )}

      {step === 3 && (
        <SkillsStep
          formData={formData}
          updateFormData={updateFormData}
          back={goBack}
          onFinish={handleSubmit}
        />
      )}
    </div>
  );
};

export default Signup;