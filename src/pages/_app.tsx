import type {AppProps} from 'next/app';
import '../styles/css/tailwind.css';
import {QueryClient, QueryClientProvider} from 'react-query';
import {ReactQueryDevtools} from 'react-query/devtools';
const queryClient = new QueryClient();
export default function App({Component, pageProps}: AppProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<Component {...pageProps} />
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
