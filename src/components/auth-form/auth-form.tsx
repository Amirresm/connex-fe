import api from "@/api/api";
import { CheckBadgeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

function Login() {
	const qc = useQueryClient();

	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	const [error, setError] = React.useState("");

	const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		try {
			const { access_token, token_type } = await api.login(username, password);
			localStorage.setItem("token", access_token);
			qc.invalidateQueries({ queryKey: ["auth_info"] });
		} catch (e) {
			setError("Failed to login.");
		}
	}, [password, qc, username]);

	return (
		<form
			className="w-2/3 flex flex-col justify-center items-center gap-4 p-4"
			onSubmit={handleSubmit}
		>
			{/* <div className="my-1 text-2xl font-bold"> */}
			{/* 	Login */}
			{/* </div> */}
			<div className="w-full flex flex-col gap-2">
				<label className="input input-bordered input-lg flex items-center gap-2">
					<UserIcon className="w-5" />
					<input name="username" type="text" className="grow" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label className="input input-bordered input-lg flex items-center gap-2">
					<KeyIcon className="w-5" />
					<input name="password" type="password" className="grow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
			</div>
			<div className="w-full mt-2">
				<div className="h-4 text-xs text-error mb-4">{error}</div>
				<button className="btn w-full btn-lg" type="submit">
					Login
				</button>
			</div>
		</form >);
}

function Signup() {
	const qc = useQueryClient();

	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	const [error, setError] = React.useState("");

	const handleSubmit = React.useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		try {
			const { access_token, token_type } = await api.signup(username, password);
			localStorage.setItem("token", access_token);
			qc.invalidateQueries({ queryKey: ["auth_info"] });
		} catch (e) {
			setError("Failed to signup.");
		}
	}, [password, qc, username]);

	return (
		<form
			className="w-2/3 flex flex-col justify-center items-center gap-4 p-4"
			onSubmit={handleSubmit}
		>
			{/* <div className="my-8 text-5xl font-bold"> */}
			{/* 	Signup */}
			{/* </div> */}
			<div className="w-full flex flex-col gap-2">
				<label className="input input-bordered input-lg flex items-center gap-2">
					<UserIcon className="w-5" />
					<input name="username" type="text" className="grow" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
				</label>
				<label className="input input-bordered input-lg flex items-center gap-2">
					<KeyIcon className="w-5" />
					<input name="password" type="password" className="grow" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
				</label>
			</div>
			<div className="w-full mt-2">
				<div className="h-4 text-xs text-error mb-4">{error}</div>
				<button className="btn w-full btn-lg" type="submit">
					Signup
				</button>
			</div>
		</form >);
}

export default function AuthForm() {
	const [state, setState] = React.useState<"login" | "signup">("login");

	return <div className="w-1/2 min-w-[500px] max-w-[700px] h-2/3 min-h-[500px] max-h-[700px] flex flex-col justify-between items-center gap-4 rounded-lg bg-base-100 border border-neutral-700">
		<div className="mt-20">
			<div className="flex flex-row gap-2 mt-4 mx-2 items-center justify-center text-secondary">
				<CheckBadgeIcon className="w-16 brand-svg" />
				<span className="text-5xl brand-text">Fact Checker</span>
			</div>
		</div>
		{state === "login" ? <Login /> : <Signup />}
		<button className="btn btn-ghost mb-16" onClick={() => setState(state === "login" ? "signup" : "login")}>
			{state === "login" ? "No account? Signup." : "Already signed up? Login."}
		</button>
	</div>;
}
