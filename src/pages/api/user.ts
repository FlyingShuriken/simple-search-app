import type { NextApiRequest, NextApiResponse } from "next";

const REQUEST_URL = "https://fetest.mashx.click/api/users";

type Data = {
	id: number;
	name: string;
	email: string;
	email_verified_at: Date;
	created_at: Date;
	updated_at: Date;
}[];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { query, method } = req;
	const name: string | undefined = query.name
		? (query.name as string)
		: undefined;

	if (method === "GET") {
		const profiles = [];
		// Initial fetch to get the nextPageURL
		const request = await fetch(
			`${REQUEST_URL}${
				name
					? "?" +
					  new URLSearchParams({
							query: name,
					  })
					: ""
			}`
		);

		const response = await request.json();
		const nextPage: number | undefined = response.next_page_url
			? response.next_page_url.split("page=")[1]
			: undefined;
		// Push the initial response to the profiles array
		profiles.push(...response.data);
		if (nextPage) {
			// If index of next page is specified, fetch all the pages
			let nextNumber: string = nextPage.toString();
			while (profiles.length !== response.total) {
				const request = await fetch(
					`${REQUEST_URL}${
						name
							? "?" +
							  new URLSearchParams({
									query: name,
									page: nextNumber,
							  })
							: "?" +
							  new URLSearchParams({
									page: nextNumber,
							  })
					}`
				);
				const response = await request.json();
				profiles.push(...response.data);
				nextNumber = response.next_page_url
					? response.next_page_url.split("page=")[1]
					: 0;
			}
		}
		res.status(200).json(profiles);
	}
}
