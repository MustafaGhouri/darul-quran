import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { apiRegistry } from "../redux/store";

const MultiApiDevTools = () => {
  const dispatch = useDispatch();
  const fullState = useSelector((state) => state);

  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [active, setActive] = useState(null);
  const [editArgs, setEditArgs] = useState({});

  if (process.env.NODE_ENV !== "development") return null;

  const apiNames = Object.keys(apiRegistry);

  const runQuery = (apiName, endpoint, args) => {
    const api = apiRegistry[apiName];
    dispatch(api.endpoints[endpoint].initiate(args, { forceRefetch: true }));
  };

  return (
    <div className="fixed bottom-18 right-6 z-99999 font-sans">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 rounded-xl shadow-md bg-white border border-[#406c65] text-[#406c65] font-semibold hover:bg-[#406c65] hover:text-white transition"
      >
        RTK Api DevTool ({apiNames.length})
      </button>

      {open && (
        <div
          className={`${
            full ? "fixed inset-0" : "absolute bottom-14 right-0 w-[560px] h-[75vh]"
          } bg-white shadow-2xl border border-gray-200 rounded-2xl overflow-hidden flex flex-col`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b bg-[#406c65] text-white">
            <div className="font-semibold tracking-wide">
              RTK Query DevTools
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFull(!full)}
                className="px-3 py-1 bg-white/20 rounded-md text-sm hover:bg-white/30"
              >
                {full ? "Exit" : "Full"}
              </button>

              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1 bg-white/20 rounded-md text-sm hover:bg-white/30"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-gray-50 p-3 space-y-4">
            {apiNames.map((apiName) => {
              const apiState = fullState[apiName];
              if (!apiState?.queries) return null;

              return (
                <div
                  key={apiName}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm"
                >
                  <div className="px-4 py-2 border-b bg-[#406c65]/10 text-[#406c65] font-semibold">
                     {apiName}
                  </div>

                  <div className="p-3 space-y-3">
                    {Object.values(apiState.queries).map((q) => {
                      const endpoint = q.endpointName;
                      const args = q.originalArgs;

                      return (
                        <details
                          key={q.queryCacheKey}
                          className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                        >
                          <summary className="cursor-pointer px-3 py-2 bg-gray-50 hover:bg-gray-100 flex justify-between items-center">
                            <span className="font-medium text-sm text-gray-700">
                              {endpoint}
                            </span>
                            <span className="text-xs text-gray-500">
                              {q.status}
                            </span>
                          </summary>

                          <div className="p-3 space-y-3">
                            <div>
                              <div className="text-xs font-semibold text-[#406c65] mb-1">
                                Args
                              </div>

                              <textarea
                                className="w-full text-xs p-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#406c65] font-mono"
                                rows={4}
                                value={
                                  active === q.queryCacheKey
                                    ? JSON.stringify(editArgs, null, 2)
                                    : JSON.stringify(args, null, 2)
                                }
                                onChange={(e) => {
                                  setActive(q.queryCacheKey);
                                  try {
                                    setEditArgs(JSON.parse(e.target.value));
                                  } catch {}
                                }}
                              />
                            </div>

                            <div>
                              <div className="text-xs font-semibold text-[#406c65] mb-1">
                                Response
                              </div>

                              <pre className="bg-gray-900 text-green-200 text-xs p-3 rounded-md overflow-auto max-h-60">
                                {JSON.stringify(q.data, null, 2)}
                              </pre>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  runQuery(apiName, endpoint, args)
                                }
                                className="px-3 py-1 text-xs rounded-md bg-[#406c65] text-white hover:opacity-90"
                              >
                                Refetch
                              </button>

                              <button
                                onClick={() =>
                                  runQuery(
                                    apiName,
                                    endpoint,
                                    editArgs || args
                                  )
                                }
                                className="px-3 py-1 text-xs rounded-md border border-[#406c65] text-[#406c65] hover:bg-[#406c65] hover:text-white"
                              >
                                Run Edited
                              </button>
                            </div>
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiApiDevTools;