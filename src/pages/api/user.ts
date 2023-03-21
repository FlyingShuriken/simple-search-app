import type { NextApiRequest, NextApiResponse } from "next";

const REQUEST_URL = "https://fetest.mashx.click/api/users";

type Data = {
	profiles: {
		id: number;
		name: string;
		email: string;
		email_verified_at: Date;
		created_at: Date;
		updated_at: Date;
	}[];
	nextPage: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	const { query, method } = req;
	const name: string | undefined = query.name
		? (query.name as string)
		: undefined;
	const page: string | undefined = query.page
		? (query.page as string)
		: undefined;

	if (method === "GET") {
		const profiles = [];

		// Initial fetch to get the nextPageURL
		const request = await fetch(
			`${REQUEST_URL}${
				name && page
					? "?" +
					  new URLSearchParams({
							query: name,
							page: page,
					  })
					: name && !page
					? "?" +
					  new URLSearchParams({
							query: name,
					  })
					: !name && page
					? "?" +
					  new URLSearchParams({
							page,
					  })
					: ""
			}`
		);

		const response = await request.json();

		if (page) {
			// If index of next page is specified, fetch all the pages
			const pageNumber = parseInt(page);
			for (let i = 1; i <= pageNumber; i++) {
				const request = await fetch(
					`${REQUEST_URL}${
						name
							? "?" +
							  new URLSearchParams({
									query: name,
									page: i.toString(),
							  })
							: "?" +
							  new URLSearchParams({
									page: i.toString(),
							  })
					}`
				);
				const response = await request.json();
				profiles.push(...response.data);
			}
		} else {
			// If index of next page is not specified, push the data of the first page only
			profiles.push(...response.data);
		}
		res.status(200).json({
			profiles: profiles,
			nextPage:
				response.next_page_url === null
					? null
					: response.next_page_url.split("page=")[1],
		});
	}
}
