import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ComplexButton } from '../lib/components/connect/ComplexButton'
import { useBalance } from '../lib/hooks/useBalance'

function App() {
  const balanceInfo = useBalance({
    l2TokenAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  })

  return (
    <>
      <h1>StarkPull</h1>
      <h3>Use Starknet dApps with funds on L1</h3>

      <ComplexButton></ComplexButton>
      {balanceInfo.isLoading ? "Loading..." : ""}
      {balanceInfo.isError ? "Error" : ""}
      {balanceInfo.data ? `Balance: ${balanceInfo.data.formatted}` : ""}
    </>
  )
}

export default App
