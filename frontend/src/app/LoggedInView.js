import { useCallback, useMemo } from 'react';
import { Button, Dropdown } from 'semantic-ui-react';
import { useProfile, useLogout, useSetParty } from '../contexts/profileContext';
import { useParties } from '../contexts/partiesContext';
import { useShowSensitiveData, useToggleShowSensitiveData } from '../contexts/visibilityContext';

export function LoggedInView() {
    const profile = useProfile();
    const logout = useLogout();
    const setParty = useSetParty();
    const parties = useParties();
    const showSensitiveData = useShowSensitiveData();
    const toggleShowSensitiveData = useToggleShowSensitiveData();

    const selectParty = useCallback(async (e, { value }) => {
        setParty(value);
    }, [setParty]);

    const partyOptions = useMemo(() => parties.map(party => ({
        key: party.id,
        text: party.name,
        value: party.id,
        label: { color: party.color, empty: true, circular: true }
    })), [parties]);

    const party = profile['party_affiliation'] || { name: 'Unaffiliated', color: '', is_member: false };

    return (
        <div>
            <Button icon='eye' size='mini' color={showSensitiveData ? undefined : 'red'} onClick={toggleShowSensitiveData} />
            <Dropdown labeled button text={party.name} icon='users' className={`mini icon ${party.color}`} disabled={party.is_member}>
                <Dropdown.Menu>
                    {partyOptions.map(party => (
                        <Dropdown.Item onClick={selectParty} key={party.key} {...party} />
                    ))}
                    <Dropdown.Item onClick={selectParty} text='Unaffiliated' label={{ empty: true, circular: true }} />
                </Dropdown.Menu>
            </Dropdown>
            <Dropdown labeled button text={profile.username} icon='user' className='mini icon'>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={logout} style={{ background: 'red' }}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Button size='mini' onClick={logout} color='orange'>Logout</Button>
        </div>
    );
}
