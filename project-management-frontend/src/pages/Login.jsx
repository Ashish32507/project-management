import React from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Login</h2>

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
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          Login
        </button>

        <p className="mt-4 text-sm text-center">
          New here?{" "}
          <Link className="text-blue-500" to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
