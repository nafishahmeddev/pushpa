type ScrollViewProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {};
export default function ScrollView({ children, ...props }: ScrollViewProps) {
  return <div {...props} className={`overflow-auto ${props.className}`}>{children}</div>;
}
