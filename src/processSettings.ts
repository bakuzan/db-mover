const has = (s: string | undefined): s is string => !!(s && s.trim());

const prep = (s: string | undefined) =>
  s
    ?.split(',')
    .map((x) => x.trim())
    .filter((x) => !!x) ?? [];

export default function processSettings() {
  const fromFolder = process.env.FROM_FOLDER;
  const toFolder = process.env.TO_FOLDER;
  const pattern = process.env.PATTERN;

  if (!(has(fromFolder) && has(toFolder) && has(pattern))) {
    console.log(
      'Invalid env value. FROM_FOLDER, TO_FOLDER, and PATTERN are all required.'
    );
    process.exit(0);
  }

  const froms = prep(fromFolder);
  const tos = prep(toFolder);

  if (froms.length !== tos.length && tos.length !== 1) {
    console.log('Invalid folder settings');
    console.log(
      'The number of from and to folders should be equal, or any number of from folders can map to 1 to folder.'
    );
    process.exit(0);
  }

  const mappings = [];

  for (let i = 0; i < froms.length; i++) {
    mappings.push({
      from: froms[i],
      to: tos[i] ?? tos[0]
    });
  }

  return {
    pattern,
    mappings
  };
}
