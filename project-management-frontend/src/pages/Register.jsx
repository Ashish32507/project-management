import React from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(3),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await API.post("/auth/register", data);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          {...register("name")}
          className="w-full mb-1 p-2 border rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mb-3">{errors.name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="w-full mb-1 p-2 border rounded"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="w-full mb-1 p-2 border rounded"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-3">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-2"
        >
          Register
        </button>

        <p className="mt-4 text-sm text-center">
          Already registered?{" "}
          <Link className="text-blue-500" to="/">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
