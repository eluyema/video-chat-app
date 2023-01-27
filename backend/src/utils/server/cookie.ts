function getCookie(cookieRaw: string, name: string) {
  if (!cookieRaw) {
    return '';
  }

  const match = cookieRaw.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) {
    return match[2];
  } else {
    return '';
  }
}

export { getCookie };
