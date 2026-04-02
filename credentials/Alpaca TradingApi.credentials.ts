import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class AlpacaTradingApi implements ICredentialType {
	name = 'alpacaTradingApi';
	displayName = 'Alpaca Trading API';
	documentationUrl = 'https://alpaca.markets/docs/';
	properties: INodeProperties[] = [
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Paper Trading',
					value: 'paper',
				},
				{
					name: 'Live Trading',
					value: 'live',
				},
			],
			default: 'paper',
			description: 'Choose between paper trading (simulation) or live trading environment',
		},
		{
			displayName: 'API Key ID',
			name: 'keyId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Alpaca API Key ID',
		},
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your Alpaca Secret Key',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://paper-api.alpaca.markets',
			description: 'The base URL for the Alpaca API',
			displayOptions: {
				show: {
					environment: [
						'paper',
					],
				},
			},
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.alpaca.markets',
			description: 'The base URL for the Alpaca API',
			displayOptions: {
				show: {
					environment: [
						'live',
					],
				},
			},
		},
	];
}