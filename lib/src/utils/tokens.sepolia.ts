import { SupportedToken } from "./tokens";

const TOKENS: SupportedToken[] = [
    {
        id: "eth",
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
        l1_token_address: "0x0000000000000000000000000000000000455448",
        l2_token_address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        l1_bridge_address: "0x8453FC6Cd1bCfE8D4dFC069C400B433054d47bDc",
        l2_bridge_address: "0x04c5772d1914fe6ce891b64eb35bf3522aeae1315647314aac58b01137607f3f"
    },
    {
        id: "strk",
        name: "Starknet Token",
        symbol: "STRK",
        decimals: 18,
        l1_token_address: "0xCa14007Eff0dB1f8135f4C25B34De49AB0d42766",
        l2_token_address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        l1_bridge_address: "0xcE5485Cfb26914C5dcE00B9BAF0580364daFC7a4",
        l2_bridge_address: "0x0594c1582459ea03f77deaf9eb7e3917d6994a03c13405ba42867f83d85f085d",
    },
    {
        id: "usdc",
        name: "USDC",
        symbol: "USDC",
        decimals: 6,
        l1_token_address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        l1_bridge_address: "0x86dC0B32a5045FFa48D9a60B7e7Ca32F11faCd7B",
        l2_bridge_address: "0x0028729b12ce1140cbc1e7cbc7245455d3c15fa0c7f5d2e9fc8e0441567f6b50",
        l2_token_address: "0x053b40a647cedfca6ca84f542a0fe36736031905a9639a7f19a3c1e66bfd5080"
    },
    {
        id: "usdt",
        name: "USDT",
        symbol: "USDT",
        decimals: 6,
        l1_token_address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0",
        l1_bridge_address: "0xeDAAA43e4ff599077b73893573C8AB2f843df4E6",
        l2_bridge_address: "0x3913d184e537671dfeca3f67015bb845f2d12a26e5ec56bdc495913b20acb08",
        l2_token_address: "0x02ab8758891e84b968ff11361789070c6b1af2df618d6d2f4a78b0757573c6eb"
    },
    {
        id: "wbtc",
        name: "Wrapped BTC",
        symbol: "WBTC",
        decimals: 8,
        l1_token_address: "0x92f3B59a79bFf5dc60c0d59eA13a44D082B2bdFC",
        l1_bridge_address: "0x5387FFC865D03924567f7E7BA2aa4F929ce8eEC9",
        l2_bridge_address: "0x025a3820179262679392e872d7daaa44986af7caae1f41b7eedee561ca35a169",
        l2_token_address: "0x00452bd5c0512a61df7c7be8cfea5e4f893cb40e126bdc40aee6054db955129e"
    },
    {
        id: "wsteth",
        name: "Wrapped liquid staked Ether 2.0",
        symbol: "wstETH",
        decimals: 18,
        l1_token_address: "0xB82381A3fBD3FaFA77B3a7bE693342618240067b",
        l1_bridge_address: "0xaCbb1B9021eC68370B9821d5F36ddE26796bb436",
        l2_bridge_address: "0x0172393a285eeac98ea136a4be473986a58ddd0beaf158517bc32166d0328824",
        l2_token_address: "0x030de54c07e57818ae4a1210f2a3018a0b9521b8f8ae5206605684741650ac25"
    }
]

export default TOKENS;