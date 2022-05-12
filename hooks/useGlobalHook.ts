import globalHook, { Store } from 'use-global-hook';

// Defining your own state and associated actions is required
export type MyState = {
  network: string;
};

const isLocalStorage = typeof localStorage === undefined;
const initialState: MyState = {
  network: isLocalStorage && localStorage?.network || process.env.NEXT_PUBLIC_CONNECTION_NETWORK,
};

// Associated actions are what's expected to be returned from globalHook
export type MyAssociatedActions = {
  setNetwork: (value: string) => void;
};

// setValue will be returned by globalHook as setValue.bind(null, store)
// This is one reason we have to declare a separate associated actions type
const setNetwork = (
  store: Store<MyState, MyAssociatedActions>,
  network: string
) => {
  store.setState({ ...store.state, network });
  localStorage?.setItem('network', network);
};

// actions passed to globalHook do not need to be typed
const actions = {
  setNetwork,
};

export const useGlobal = globalHook<MyState, MyAssociatedActions>(
  initialState,
  actions
);

