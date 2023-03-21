import { Profile } from "@/models/ProfileModel";

export const ProfileRow = ({ profile }: { profile: Profile }) => {
	return (
		<>
			<div
				className="
							profile 
							flex flex-col
							px-5 py-3
							bg-slate-200 dark:bg-slate-800 rounded-lg"
			>
				<div className="profileName text-xl">{profile.name}</div>
				<div className="profileEmail text-base text-gray-400 dark:text-gray-500">
					{profile.email}
				</div>
				{/* <div className="profileDates flex flex-col gap-1 py-1">
					<div className="profileEmailCreatedAt">
						Created at: {profile.created_at.toLocaleString()}
					</div>
					<div className="profileEmailVerifiedAt">
						Verified at: {profile.email_verified_at.toLocaleString()}
					</div>
					<div className="profileEmailUpdatedAt">
						Updated at: {profile.updated_at.toLocaleString()}
					</div>
				</div> */}
			</div>
		</>
	);
};
