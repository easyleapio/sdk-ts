import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { defaultStarkpullConfig, StarkpullProvider } from '../lib/components/StarkpullProvider/index.tsx'
import { connect } from 'starknetkit'
import { WebWalletConnector } from 'starknetkit/webwallet'
import { InjectedConnector } from '@starknet-react/core'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StarkpullProvider starknetConfig={{
      chains: defaultStarkpullConfig().starknetConfig.chains,
      provider: defaultStarkpullConfig().starknetConfig.provider,
      explorer: defaultStarkpullConfig().starknetConfig.explorer,
      connectors: [
        new WebWalletConnector(),
        new InjectedConnector({ options: { id: "argentX" } })
      ]
      }}>
      <App />
    </StarkpullProvider>
  </StrictMode>,
)
