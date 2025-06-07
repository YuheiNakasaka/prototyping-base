import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>プロトタイプアプリ</title>
        <meta name="description" content="迅速なプロトタイプ開発" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">プロトタイプアプリ</h1>
          <p className="text-xl text-gray-600 mb-8">迅速な開発を始めましょう</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors" type="button">
            開始する
          </button>
        </div>
      </main>
    </div>
  );
}
