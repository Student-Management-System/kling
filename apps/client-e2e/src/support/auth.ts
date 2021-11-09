const user = {
	user: {
		id: "41352fcc-9b4b-4215-bf29-693f7488a2df",
		matrNr: null,
		email: null,
		username: "user",
		displayName: "user",
		role: "SYSTEM_ADMIN",
		courses: [
			{
				id: "test-course-wise2122",
				shortname: "test-course",
				semester: "wise2122",
				title: "Test-Course: I",
				isClosed: false
			}
		]
	},
	accessToken:
		"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJMSVZFIHNwYXJreXNlcnZpY2UtYXBpIiwiYXVkIjoiTElWRSBzcGFya3lzZXJ2aWNlLWFwcCIsInN1YiI6InVzZXIiLCJleHAiOjE2MzY1NzE2ODAsInJvbCI6WyJBRE1JTiJdLCJyZWFsbSI6Ik1FTU9SWSIsImp0aSI6IjhkZTc4MjZlLTUzNjUtNDNlNy05ZWE2LWYyM2ZmMDFjY2NmMyJ9.QdNNHXMwEfTChmqN1wOFi42KTFubMVRt2hqrRpEc9FtKKomN33UmAyRYoBwIiugkzqjiX4FdbtrTJXz05BAbYw"
};

/**
 * Writes the given `account` information to the browser's `localStorage`, so it is used for
 * authenticated requests to the backend.
 *
 * @param account Object that would be returned from the API's `/auth/whoAmI` route.
 */
export function useAccount(): void {
	window.localStorage.setItem("studentMgmtToken", JSON.stringify(user));
}
