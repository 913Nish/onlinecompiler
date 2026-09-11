import React, { useState } from 'react';
import { ASTNode } from '../types';
import {
  FolderTree,
  ChevronRight,
  ChevronDown,
  Search,
  Maximize2,
  Minimize2,
  Tag,
} from 'lucide-react';

interface AstViewerProps {
  ast?: ASTNode;
}

export const AstViewer: React.FC<AstViewerProps> = ({ ast }) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-program': true,
    'fn-1': true,
    'var-1': true,
  });
  const [filterText, setFilterText] = useState('');

  if (!ast) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-sm">
        <FolderTree className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
        <p>No AST generated yet. Click "Compile & Emit" to parse syntax tree.</p>
      </div>
    );
  }

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    function collect(node: ASTNode) {
      all[node.id] = true;
      if (node.children) {
        node.children.forEach(collect);
      }
    }
    collect(ast);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes({});
  };

  const getNodeBadgeColor = (type: string) => {
    switch (type) {
      case 'Program':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'FunctionDeclaration':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'VariableDeclaration':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'ForStatement':
      case 'WhileStatement':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'BinaryExpression':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'ReturnStatement':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const renderNode = (node: ASTNode, depth = 0) => {
    const isExpanded = expandedNodes[node.id] !== false;
    const hasChildren = Boolean(node.children && node.children.length > 0);

    const matchesFilter =
      !filterText ||
      node.name.toLowerCase().includes(filterText.toLowerCase()) ||
      node.type.toLowerCase().includes(filterText.toLowerCase()) ||
      (node.detail && node.detail.toLowerCase().includes(filterText.toLowerCase()));

    return (
      <div key={node.id} className="text-xs font-mono">
        <div
          onClick={() => hasChildren && toggleNode(node.id)}
          style={{ paddingLeft: `${depth * 20}px` }}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-slate-800/60 cursor-pointer transition-colors group ${
            matchesFilter && filterText ? 'bg-indigo-950/60 ring-1 ring-indigo-500/40' : ''
          }`}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="text-slate-500 hover:text-slate-300 p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4 text-center text-slate-600 font-bold">•</span>
          )}

          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold tracking-wide ${getNodeBadgeColor(
              node.type
            )}`}
          >
            {node.type}
          </span>

          <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
            {node.name}
          </span>

          {node.detail && (
            <span className="text-slate-400 font-sans text-[11px] truncate max-w-xs md:max-w-md">
              {node.detail}
            </span>
          )}

          {node.line && (
            <span className="ml-auto text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded">
              L{node.line}
            </span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="border-l border-slate-800/80 ml-4 pl-1 mt-0.5">
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#11141d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 bg-[#161a26] border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-purple-400" />
          <span className="font-semibold text-slate-200">Abstract Syntax Tree (AST)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800">
            Multi-Language Parser
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
            <input
              type="text"
              placeholder="Filter nodes..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-lg pl-7 pr-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={expandAll}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
            title="Expand all tree branches"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Expand</span>
          </button>

          <button
            onClick={collapseAll}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs transition-colors"
            title="Collapse tree branches"
          >
            <Minimize2 className="w-3 h-3" />
            <span className="hidden sm:inline">Collapse</span>
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 p-3.5 overflow-auto space-y-1">
        {renderNode(ast)}
      </div>

      {/* Legend Footer */}
      <div className="px-3.5 py-2 bg-[#0e111a] border-t border-slate-800 text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3 text-purple-400" /> Legend:
        </span>
        <span className="text-purple-300 font-mono">Program</span>
        <span className="text-indigo-300 font-mono">Function</span>
        <span className="text-cyan-300 font-mono">Variable</span>
        <span className="text-amber-300 font-mono">Loop</span>
        <span className="text-rose-300 font-mono">Return</span>
      </div>
    </div>
  );
};
