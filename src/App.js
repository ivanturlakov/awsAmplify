import React from "react";
import { Router, Route } from "react-router-dom";
import { API, graphqlOperation, Auth, Hub } from "aws-amplify";
import { getUser } from "./graphql/queries";
import { createUser } from "./graphql/mutations";
import { Authenticator, AmplifyTheme } from "aws-amplify-react";
import createBrowserHistory from "history/createBrowserHistory";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import MarketPage from "./pages/MarketPage";
import Navbar from "./components/Navbar";
import "./App.css";

export const history = createBrowserHistory();

export const UserContext = React.createContext();

class App extends React.Component {
  state = {
    user: null,
    userAttributes: null
  };

  componentDidMount() {
    // Theme styles
    // console.dir(AmplifyTheme);
    this.getUserData();
    // Hub.listen('auth', this, 'onHubCapsule')
    Hub.listen('auth', data => {
			switch(data.payload.event) {
        case "signIn":
          console.log("Signed In")
          this.getUserData();
          this.registerNewUser(data.payload.data)
          break;
        case "signUp":
          console.log("Signed Up")
          this.getUserData()
          break;
        case "signOut":
          console.log("Signed Out")
          this.setState({ user: null })
          break;
        default:
          return;
      }
		})
  }

  getUserData = async () => {
    const user = await Auth.currentAuthenticatedUser();
    user ? this.setState({ user }, () => this.getUserAttributes(this.state.user)) : this.setState({ user: null })
  }

  getUserAttributes = async authUserData => {
    const attributesArr = await Auth.userAttributes(authUserData);
    const attributesObj = Auth.attributesToObject(attributesArr);
    this.setState({ userAttributes: attributesObj });
  }

  registerNewUser = async signInData => {
    const getUserInput = {
      id: signInData.signInUserSession.idToken.payload.sub
    }
    const { data } = await API.graphql(graphqlOperation(getUser, getUserInput))
    if(!data.getUser) {
      try {
        const registerUserInput = {
          ...getUserInput,
          username: signInData.username,
          email: signInData.signInUserSession.idToken.payload.email,
          registered: true
        }
        const newUser = await API.graphql(graphqlOperation(createUser, { input: registerUserInput }))
        console.log({ newUser })
      } catch(err) {
        console.error("Error registering new user", err)
      }
    }
  }

  handleSignOut = async () => {
    try {
      await Auth.signOut()
    } catch(err) {
      console.error("Error signing out", err)
    }
  }

  render() {
    const { user, userAttributes } = this.state;

    return !user ? (
      <Authenticator theme={theme}/>
    ) : (
      <UserContext.Provider value={{ user, userAttributes }}>
        <Router history={history}>
          <>
            {/* Navigation */}
            <Navbar user={user} handleSignOut={this.handleSignOut} />

            {/* Routes */}
            <div className="app-container">
              <Route exact path="/" component={HomePage} />
              <Route path="/profile" component={() => <ProfilePage user={user} userAttributes={userAttributes} />} />
              <Route path="/markets/:marketId" component={
                ({ match }) => <MarketPage user={user} userAttributes={userAttributes} marketId={match.params.marketId} />
              } />
            </div>
          </>
        </Router>
      </UserContext.Provider>
    )
  }
}

const theme = {
  ...AmplifyTheme,
  navBar: {
    ...AmplifyTheme.navBar,
    backgroundColor: "#eee"
  }
}

// export default withAuthenticator(App, true, [], null, theme);
export default App;


// UserName: IvanT
// Pass: lastname84

// UserName: Freediver
// Pass: freediver84
