'use client'
import {ReactNode} from 'react';
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, http } from 'wagmi';
import {sepolia} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import {NextUIProvider} from "@nextui-org/system";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'My First App',
  projectId: 'cf8552a78992e71271c1a79a34ec7c50',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
  ssr: true, // If your dApp uses server side rendering (SSR)
});

interface ProviderProps {
  children: ReactNode
}

export default function Provider({children}: ProviderProps) {

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <NextUIProvider>
            {children}
          </NextUIProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
