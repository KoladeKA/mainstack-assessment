
import './App.css'
import { AppWrapperComp } from './components/ui/appWrapper'
import { DashboardPage } from './pages/dashboard'

function App() {

	return (
		<>
			<AppWrapperComp>
				<DashboardPage />
			</AppWrapperComp>
			{/* <div>
				<a href="https://vite.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div> */}
		</>
	)
}

export default App
