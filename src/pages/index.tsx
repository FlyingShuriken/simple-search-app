import { Header } from "@/components/Header";
import { ProfileRow } from "@/components/ProfileRow";
import { Profile } from "@/models/ProfileModel";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
	const [name, setName] = useState<string>("");
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const [nextPage, setNextPage] = useState<string>();
	const [isFetching, setIsFetching] = useState<boolean>(false);

	// Fetching data from the API
	const fetchData = async (url: string, running: boolean) => {
		const req = await fetch(url);
		const res = await req.json();

		// Check if the component is still mounted
		if (running) {
			// Set the profiles and the next page
			setProfiles([
				...res.profiles.map((profile: any) => ({
					// Convert the date string to a Date object
					...profile,
					email_verified_at: new Date(profile.email_verified_at),
					created_at: new Date(profile.created_at),
					updated_at: new Date(profile.updated_at),
				})),
			]);

			// Set the next page url
			setNextPage(res.nextPage);
		}
		return;
	};

	useEffect(() => {
		let running = true;

		fetchData(`/api/user${name === "" ? "" : "?name=" + name}`, running);

		return () => {
			running = false;
		};
	}, [name]);

	useEffect(() => {
		let running = true;

		// Infinite scroll
		// Check if the user has scrolled to the bottom of the page
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop !==
					document.documentElement.offsetHeight ||
				isFetching
			) {
				return;
			}
			if (nextPage) {
				setIsFetching(true);
				fetchData(
					`/api/user${
						name !== ""
							? nextPage
								? "?name=" + name + "&page=" + nextPage
								: "?name=" + name
							: "?page=" + nextPage
					}`,
					running
				);
				setIsFetching(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			running = false;
			window.removeEventListener("scroll", handleScroll);
		};
	}, [nextPage, isFetching]);

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
					<div className="searchBox">
						<input
							type="text"
							name="name"
							placeholder="Search"
							defaultValue={name}
							onChange={(e) => setName(e.target.value || "")}
							className={`"
                          placeholder:italic
                          ${name ? "w-full" : "w-64"} hover:w-full focus:w-full
                          transition-all duration-500 ease-in-out
                        bg-white dark:bg-black border border-slate-400 dark:border-slate-200 outline-none rounded-lg px-3 py-1`}
						/>
					</div>
					<div className="profiles flex flex-col gap-3 pt-5">
						{profiles.map((profile) => (
							<ProfileRow profile={profile} key={profile.id} />
						))}
					</div>
				</div>
			</div>
		</>
	);
}
