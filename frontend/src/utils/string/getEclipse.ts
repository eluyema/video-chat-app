const getEclipse = (text: string, eclipseEdge: number) => 
    text.length > eclipseEdge ? text.slice(0, eclipseEdge - 1) + '...' : text;

export { getEclipse };