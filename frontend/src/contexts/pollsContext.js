import { useState, createContext, useCallback, useEffect, useContext } from "react";
import useApiUrl from '../effects/useApiUrl';
import { useProfile } from './profileContext';

const PollsContext = createContext();

export function PollsProvider({ children }) {
    const [polls, setPolls] = useState([]);
    const [pollsFilter, setPollsFilter] = useState({
        includeExpired: false,
        includeUpcoming: true,
        textFilter: '',
        page: 1,
        pageSize: 9,
    });
    const [pages, setPages] = useState(1);
    const pollsUrl = useApiUrl('polls');
    const profile = useProfile();

    const refreshPolls = useCallback(async () => {
        if (!profile)
            return setPolls([]);

        const params = new URLSearchParams();
        params.append('include_expired', pollsFilter.includeExpired);
        params.append('include_upcoming', pollsFilter.includeUpcoming);
        params.append('text_filter', pollsFilter.textFilter);
        params.append('page', pollsFilter.page);
        params.append('page_size', pollsFilter.pageSize);

        const parametrizedPollsUrl = `${pollsUrl}?${params.toString()}`;

        const response = await fetch(parametrizedPollsUrl, { credentials: 'include' });

        if (!response.ok)
        {
            setPolls([]);
            setPages(1);
            return;
        }

        const data = await response.json();

        setPages(Math.ceil(data.total_count / pollsFilter.pageSize));
        setPolls(data.polls);
    }, [pollsUrl, profile, pollsFilter]);

    useEffect(() => {
        refreshPolls();
    }, [refreshPolls]);

    return (
        <PollsContext.Provider value={{ polls, pollsFilter, setPollsFilter, pages }}>
            {children}
        </PollsContext.Provider>
    );
}

export function usePolls() {
    return useContext(PollsContext).polls;
}

export function usePollsFilter() {
    return useContext(PollsContext).pollsFilter;
}

export function useSetPollsFilter() {
    return useContext(PollsContext).setPollsFilter;
}

export function usePages() {
    return useContext(PollsContext).pages;
}