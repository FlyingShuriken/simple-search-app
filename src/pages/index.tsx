import { Header } from "@/components/Header";
import { ProfileRow } from "@/components/ProfileRow";
import { Profile } from "@/models/ProfileModel";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
	const [name, setName] = useState<string>("");
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [autoCompleteNames, setAutoCompleteNames] = useState<string[]>([]);

	// Fetching data from the API
	const fetchData = async (url: string, running: boolean) => {
		const req = await fetch(url);
		const res = await req.json();

		// Check if the component is still mounted
		if (running) {
			// Set the profiles and the next page
			const data = [
				...res.map((profile: any) => ({
					// Convert the date string to a Date object
					...profile,
					email_verified_at: new Date(profile.email_verified_at),
					created_at: new Date(profile.created_at),
					updated_at: new Date(profile.updated_at),
				})),
			];
			setProfiles(data);
			return data;
		}
		return profiles;
	};

	useEffect(() => {
		let running = true;

		fetchData(`/api/user${name === "" ? "" : "?name=" + name}`, running).then(
			(profilesLocal: Profile[]) => {
				if (name !== "")
					// Set the autocomplete names
					setAutoCompleteNames(
						profilesLocal
							.map((profile) => profile.name)
							.filter((nameLocal) =>
								nameLocal.toLowerCase().startsWith(name.toLowerCase())
							)
					);
				else setAutoCompleteNames([]);
			}
		);

		return () => {
			running = false;
		};
	}, [name]);

	const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
		setName(e.target.value || "");
	};

	return (
		<>
			<Head>
				<title>Simple Search App</title>
				<meta name="description" content="a simple search app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<div className="main min-h-screen flex flex-col bg-white dark:bg-gray-900">
				<Header />
				<div className="content min-h-[90vh] my-12 mx-6 sm:mx-24 text-black dark:text-white">
					<div className="searchBox flex flex-row gap-2">
						<input
							type="text"
							name="name"
							placeholder="Search"
							value={name}
							onChange={handleName}
							className={`"
                          placeholder:italic
                          ${name ? "w-full" : "w-64"} hover:w-full focus:w-full
                          transition-all duration-500 ease-in-out
                        bg-white dark:bg-black border border-slate-400 dark:border-slate-200 outline-none rounded-lg px-3 py-1`}
						/>
						<button
							className="border rounded-lg px-2 py-1"
							onClick={() => {
								setName("");
								setAutoCompleteNames([]);
							}}
						>
							Clear
						</button>
						<Link
							href={`/search/${name}`}
							className="border rounded-lg px-2 py-1"
						>
							{" "}
							Search
						</Link>
					</div>
					{autoCompleteNames.length > 0 &&
						(autoCompleteNames.length !== 1 || autoCompleteNames[0] !== name ? (
							<div className="autocomplete absolute bg-white dark:bg-black border border-slate-400 dark:border-slate-200 rounded-lg mt-2">
								{autoCompleteNames.map((nameLocal) => (
									<div
										key={nameLocal}
										className="name px-2 my-1 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
										onClick={() => setName(nameLocal)}
									>
										{nameLocal}
									</div>
								))}
							</div>
						) : (
							<></>
						))}
					{/* <div className="profiles flex flex-col gap-3 pt-5">
						{profiles.map((profile) => (
							<ProfileRow profile={profile} key={profile.id} />
						))}
					</div> */}
				</div>
			</div>
		</>
	);
}
