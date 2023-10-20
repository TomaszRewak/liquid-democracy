import './App.css';
import { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { ProfileProvider, useProfile } from '../contexts/profileContext';
import { PartiesProvider } from '../contexts/partiesContext';
import { VisibilityProvider } from '../contexts/visibilityContext';
import Landing from '../pages/landing/Landing';
import { LoggedInView } from './LoggedInView';
import { LogInView } from './LogInView';
import { TopBar } from './TopBar';

function AppContent({ children }) {
    const profile = useProfile();

    if (!profile) {
        return (
            <TopBar>
                <LogInView />
                <Landing />
            </TopBar>
        );
    }

    return (
        <Fragment>
            <TopBar>
                <LoggedInView profile={profile} />
            </TopBar>
            <Container className='main'>
                {children}
            </Container>
        </Fragment>
    );
}

function App({ children }) {
    return (
        <VisibilityProvider>
            <ProfileProvider>
                <PartiesProvider>
                    <AppContent>
                        {children}
                    </AppContent>
                </PartiesProvider>
            </ProfileProvider>
        </VisibilityProvider>
    );
}

export default App;
