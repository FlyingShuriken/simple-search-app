import { Header } from "@/components/Header";
import { ProfileRow } from "@/components/ProfileRow";
import { Profile } from "@/models/ProfileModel";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Profiles() {
	const router = useRouter();
	const { name } = router.query;
	const [profiles, setProfiles] = useState<Profile[]>([]);

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

		fetchData(`/api/user${name === "" ? "" : "?name=" + name}`, running);

		return () => {
			running = false;
		};
	}, [name]);

	return (
		<>
			<div className="main min-h-screen flex flex-col bg-white dark:bg-gray-900">
				<Header />

				<div className="content min-h-[90vh] my-12 mx-6 sm:mx-24 text-black dark:text-white">
					<Link
						href={"/"}
						className="border rounded-lg px-2 py-1 text-black dark:text-white w-fit"
					>
						Back
					</Link>
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
