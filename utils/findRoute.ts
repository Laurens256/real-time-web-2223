import routes from '../routes/routes.js';

// function om de juiste route te vinden bij de url
const findRoute = async (reqUrl: string) => {
	const urlPathSegments = reqUrl.split('/').slice(1).filter((segment) => segment);

	routeLoop:
	for (const [i, route] of routes.entries()) {
		const routeSegments = route.path.split('/').slice(1).filter((segment) => segment);
		// als het aantal segments van de route niet overeenkomt met die van de url, is dit niet de juiste route
		if (urlPathSegments.length !== routeSegments.length) continue;

		// loop om te kijken welk deel van de route een parameter is
		let param: string = '';
		for (let i = 0; i < routeSegments.length; i++) {
			if (routeSegments[i].startsWith(':')) {
				param = urlPathSegments[i];
			} else if (routeSegments[i] !== urlPathSegments[i]) {
				// als de route niet overeenkomt met de url en geen param is gevonden, is dit niet de juiste route
				continue routeLoop;
			}
		}

		return { route: route, param: param };
	}
	// return error route
	return { route: routes[routes.length - 1], param: undefined };
}

export { findRoute };