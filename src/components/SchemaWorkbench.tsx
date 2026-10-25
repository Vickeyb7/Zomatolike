import React, { useState } from 'react';
import { 
  SCHEMA_TABLES, 
  POSTGRES_DDL_SQL, 
  PRISMA_SCHEMA, 
  VERCEL_GITHUB_PLAYBOOK,
  SchemaTable 
} from '../data/schemaSpec';
import { 
  Database, 
  Table, 
  Key, 
  Copy, 
  Check, 
  Download, 
  GitBranch, 
  ExternalLink, 
  FileCode, 
  Terminal,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';

export const SchemaWorkbench: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'erd' | 'sql' | 'prisma' | 'api' | 'vercel'>('erd');
  const [selectedTableName, setSelectedTableName] = useState<string>('restaurants');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const selectedTable: SchemaTable = 
    SCHEMA_TABLES.find((t) => t.name === selectedTableName) || SCHEMA_TABLES[2];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedType(label);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
          <Database className="w-4 h-4" />
          <span>PM Architecture &amp; Database Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Zomato Lite Full-Stack Data Model &amp; Vercel Migration
        </h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Production schema blueprint for user profiles, restaurant catalog, real-time reviews stream, and menu management with PostgreSQL DDL, Prisma ORM, and deployment playbooks.
        </p>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveSection('erd')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'erd'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Entity Relationship (ERD)
          </button>

          <button
            onClick={() => setActiveSection('sql')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'sql'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            PostgreSQL DDL (schema.sql)
          </button>

          <button
            onClick={() => setActiveSection('prisma')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'prisma'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Prisma ORM Schema
          </button>

          <button
            onClick={() => setActiveSection('api')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'api'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            REST API Contracts
          </button>

          <button
            onClick={() => setActiveSection('vercel')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeSection === 'vercel'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-[#17181f] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            GitHub &amp; Vercel Playbook
          </button>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE ERD INSPECTOR */}
      {activeSection === 'erd' && (
        <div className="space-y-6">
          {/* Table Selector Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500 font-semibold mr-1">Tables:</span>
            {SCHEMA_TABLES.map((t) => (
              <button
                key={t.name}
                onClick={() => setSelectedTableName(t.name)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                  selectedTableName === t.name
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-[#17181f] text-zinc-400 border border-zinc-800 hover:text-white'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Selected Table Inspector */}
          <div className="bg-[#17181f] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                    {selectedTable.category}
                  </span>
                  <h2 className="text-xl font-bold font-mono text-white">
                    {selectedTable.name}
                  </h2>
                </div>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  {selectedTable.description}
                </p>
              </div>

              <div className="text-xs text-zinc-400 font-mono">
                {selectedTable.columns.length} columns · {selectedTable.indexes.length} index(es)
              </div>
            </div>

            {/* Columns Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121319] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 font-mono">
                  <tr>
                    <th className="py-3 px-6">Column Name</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Keys &amp; Constraints</th>
                    <th className="py-3 px-4">Nullable</th>
                    <th className="py-3 px-6">Purpose / Functional PM Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {selectedTable.columns.map((col) => (
                    <tr key={col.name} className="hover:bg-zinc-800/20">
                      <td className="py-3 px-6 font-bold text-white flex items-center gap-1.5">
                        {col.isPrimary && (
                          <span title="Primary Key"><Key className="w-3.5 h-3.5 text-amber-400 shrink-0" /></span>
                        )}
                        {col.isForeign && (
                          <span title="Foreign Key"><ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" /></span>
                        )}
                        <span>{col.name}</span>
                      </td>
                      <td className="py-3 px-4 text-cyan-300">{col.type}</td>
                      <td className="py-3 px-4 text-zinc-400">
                        {col.isPrimary && <span className="text-amber-400">PK (uuid)</span>}
                        {col.isForeign && <span className="text-cyan-400 font-sans">{col.references}</span>}
                        {!col.isPrimary && !col.isForeign && <span className="text-zinc-600">-</span>}
                      </td>
                      <td className="py-3 px-4">
                        {col.isNullable ? (
                          <span className="text-zinc-500">YES</span>
                        ) : (
                          <span className="text-rose-400 font-semibold">NOT NULL</span>
                        )}
                      </td>
                      <td className="py-3 px-6 font-sans text-zinc-300">
                        {col.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Indexes footer */}
            <div className="p-4 bg-[#121319] border-t border-zinc-800 font-mono text-xs">
              <span className="text-zinc-400 font-semibold block mb-1">
                Optimized B-Tree Indexes:
              </span>
              <ul className="space-y-1 text-zinc-300">
                {selectedTable.indexes.map((idx, i) => (
                  <li key={i} className="text-cyan-400/90">{idx}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* High-Level Relational Topology Card */}
          <div className="bg-[#17181f] border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 mb-3">
              Core Architectural Invariants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-zinc-400">
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="font-semibold text-white block mb-1">1. Menu Isolation</span>
                Menu items and categories are scoped under <code className="text-cyan-400">restaurant_id</code> with cascade deletion. Changes in restaurant partner portal instantly invalidate edge cache.
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="font-semibold text-white block mb-1">2. Rating Aggregation</span>
                Rolling average ratings (`3.7 / 5`) are computed via PostgreSQL database triggers on insert/update of reviews for zero-latency queries.
              </div>
              <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
                <span className="font-semibold text-white block mb-1">3. Immutable Orders</span>
                When an order is created, item names and unit prices are snapshot into <code className="text-cyan-400">order_items</code> to guarantee historical financial accuracy.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: POSTGRESQL DDL (schema.sql) */}
      {activeSection === 'sql' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">
              Ready to execute in Supabase SQL editor, Neon console, or psql
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(POSTGRES_DDL_SQL, 'sql')}
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedType === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy SQL
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownloadFile('zomato_lite_schema.sql', POSTGRES_DDL_SQL)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download schema.sql
              </button>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl p-5 overflow-x-auto text-xs font-mono text-zinc-300 max-h-[600px] leading-relaxed">
            <pre>{POSTGRES_DDL_SQL}</pre>
          </div>
        </div>
      )}

      {/* SECTION 3: PRISMA SCHEMA */}
      {activeSection === 'prisma' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400 font-mono">
              Save as <code className="text-cyan-400">prisma/schema.prisma</code> for TypeScript type-safety
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(PRISMA_SCHEMA, 'prisma')}
                className="px-3.5 py-1.5 text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                {copiedType === 'prisma' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Prisma
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownloadFile('schema.prisma', PRISMA_SCHEMA)}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download schema.prisma
              </button>
            </div>
          </div>

          <div className="bg-[#0b0c10] border border-zinc-800 rounded-2xl p-5 overflow-x-auto text-xs font-mono text-zinc-300 max-h-[600px] leading-relaxed">
            <pre>{PRISMA_SCHEMA}</pre>
          </div>
        </div>
      )}

      {/* SECTION 4: REST API SPEC */}
      {activeSection === 'api' && (
        <div className="bg-[#17181f] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-zinc-800">
            <h2 className="text-base font-semibold text-white">
              Zomato Lite Production RESTful API Specifications
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Clean endpoints designed for Next.js App Router API handlers or Express.js server routes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#121319] text-zinc-400 uppercase tracking-wider border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Auth / Scope</th>
                  <th className="py-3 px-6">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <tr>
                  <td className="py-3 px-4 text-emerald-400 font-bold">GET</td>
                  <td className="py-3 px-4 text-white">/api/restaurants</td>
                  <td className="py-3 px-4 text-zinc-400">Public</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Returns restaurant directory filtered by sector, query, or minimum rating.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-emerald-400 font-bold">GET</td>
                  <td className="py-3 px-4 text-white">/api/restaurants/:id</td>
                  <td className="py-3 px-4 text-zinc-400">Public</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Fetches single restaurant profile with initials, sectors, cost, and aggregate stats.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-emerald-400 font-bold">GET</td>
                  <td className="py-3 px-4 text-white">/api/restaurants/:id/menu</td>
                  <td className="py-3 px-4 text-zinc-400">Public</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Returns hierarchical categories and active dishes for customer ordering.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-cyan-400 font-bold">POST</td>
                  <td className="py-3 px-4 text-white">/api/restaurants/:id/menu/items</td>
                  <td className="py-3 px-4 text-rose-400">Partner / Admin</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Creates a new dish entry in restaurant catalog with price and veg flag.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-amber-400 font-bold">PATCH</td>
                  <td className="py-3 px-4 text-white">/api/menu-items/:id/availability</td>
                  <td className="py-3 px-4 text-rose-400">Partner / Admin</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Toggles live in-stock availability flag when an ingredient runs out in kitchen.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-cyan-400 font-bold">POST</td>
                  <td className="py-3 px-4 text-white">/api/reviews</td>
                  <td className="py-3 px-4 text-emerald-400">Customer (JWT)</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Publishes review, rating (1-5), and dish tag. Triggers average rating recalculation.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-cyan-400 font-bold">POST</td>
                  <td className="py-3 px-4 text-white">/api/orders</td>
                  <td className="py-3 px-4 text-emerald-400">Customer (JWT)</td>
                  <td className="py-3 px-6 font-sans text-zinc-300">
                    Creates atomic order transaction, locks item prices, and returns payment intent.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 5: VERCEL & GITHUB PLAYBOOK */}
      {activeSection === 'vercel' && (
        <div className="space-y-6">
          <div className="bg-[#17181f] border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-2">
              {VERCEL_GITHUB_PLAYBOOK.title}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {VERCEL_GITHUB_PLAYBOOK.summary}
            </p>
          </div>

          <div className="space-y-4">
            {VERCEL_GITHUB_PLAYBOOK.steps.map((st) => (
              <div
                key={st.step}
                className="bg-[#17181f] border border-zinc-800/80 rounded-2xl p-6 shadow-md"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs font-mono font-bold">
                    {st.step}
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {st.title}
                  </h3>
                </div>

                <div className="bg-[#0b0c10] border border-zinc-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto mb-3">
                  {st.commands.map((cmd, idx) => (
                    <div key={idx} className="py-0.5">
                      {cmd}
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-400 pl-1">
                  <span className="text-zinc-500 font-semibold">Note:</span> {st.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
