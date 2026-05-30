export const darkTheme = {
	backgroundColor: '#111827',
	gridColor: 'rgba(255,255,255,0.06)',
	tickColor: '#8B95A5',
	primaryColor: '#00D4B4',
	secondaryColor: '#F5A623',
	dangerColor: '#EF4444',
	successColor: '#10B981',
	fontFamily: 'Inter, system-ui, sans-serif'
};

export function baseScaleOptions() {
	return {
		x: {
			ticks: { color: darkTheme.tickColor, font: { family: darkTheme.fontFamily } },
			grid: { color: darkTheme.gridColor }
		},
		y: {
			ticks: { color: darkTheme.tickColor, font: { family: darkTheme.fontFamily } },
			grid: { color: darkTheme.gridColor }
		}
	};
}

export function basePluginOptions(title: string) {
	return {
		legend: { labels: { color: '#E8ECF1', font: { family: darkTheme.fontFamily } } },
		title: {
			display: true,
			text: title,
			color: '#E8ECF1',
			font: { size: 16, family: darkTheme.fontFamily }
		},
		tooltip: {
			backgroundColor: '#1A2035',
			titleColor: '#E8ECF1',
			bodyColor: '#E8ECF1',
			borderColor: '#1E293B',
			borderWidth: 1
		}
	};
}
