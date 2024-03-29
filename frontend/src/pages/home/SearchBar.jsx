import { Checkbox, Input, Menu } from "semantic-ui-react";
import { usePollsFilter, useSetPollsFilter } from "../../contexts/pollsContext";
import { useCallback } from "react";
import './SearchBar.css';

export default function SearchBar() {
    const pollsFilter = usePollsFilter();
    const setPollsFilter = useSetPollsFilter();

    const textFilterChanged = useCallback((e, { value }) => {
        setPollsFilter({ ...pollsFilter, textFilter: value });
    }, [pollsFilter, setPollsFilter]);

    const includeExpiredChanged = useCallback((e, { checked }) => {
        setPollsFilter({ ...pollsFilter, includeExpired: checked });
    }, [pollsFilter, setPollsFilter]);

    const includeUpcomingChanged = useCallback((e, { checked }) => {
        setPollsFilter({ ...pollsFilter, includeUpcoming: checked });
    }, [pollsFilter, setPollsFilter]);

    return (
        <Menu borderless className="search-bar">
            <Menu.Item>
                <Input value={pollsFilter.textFilter} onChange={textFilterChanged} placeholder={'Search...'} />
            </Menu.Item>
            <Menu.Item position='right'>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <Checkbox checked={pollsFilter.includeExpired} label='Include expired' onChange={includeExpiredChanged} toggle />
                    <Checkbox checked={pollsFilter.includeUpcoming} label='Include upcoming' onChange={includeUpcomingChanged} toggle />
                </div>
            </Menu.Item>
        </Menu>
    )
}