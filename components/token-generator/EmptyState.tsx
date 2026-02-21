export function EmptyState() {
  return (
    <div className="mt-8 flex flex-col items-center justify-center py-10 border border-dashed border-gray-200 rounded-xl text-center">
      <div className="text-3xl mb-3">🔑</div>
      <p className="text-sm font-medium text-gray-400">No tokens yet</p>
      <p className="text-xs text-gray-300 mt-1">Configure settings above and hit Generate</p>
    </div>
  );
}
