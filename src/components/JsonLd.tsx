/**
 * Renders a JSON-LD block.
 *
 * `dangerouslySetInnerHTML` is required — React escapes text children, which
 * would corrupt the JSON. The input is safe because every object passed here is
 * built in our own server code from our own content files, never from user
 * input or a third-party API.
 *
 * `JSON.stringify` output is still passed through a `<` escape as defence in
 * depth: if a content string ever contained `</script>`, the raw sequence would
 * close the tag early and the remainder would be parsed as HTML.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
