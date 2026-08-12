export function generateProjectKey(name: string): string {
  const words = name.trim().toUpperCase().split(/\s+/);

  if (words.length === 1) {
    // Elixir -> ELX
    const word = words[0];

    if (word.length <= 3) {
      return word;
    }

    return word.slice(0, 2) + word[word.length - 1];
  }

  // Project Management Tool -> PMT
  return words.map((word) => word[0]).join("");
}
