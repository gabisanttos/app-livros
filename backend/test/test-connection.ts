import { AppDataSource } from '../src/data-source'

async function testConnection() {
  try {
    await AppDataSource.initialize()
    console.log('✅ Conexão com banco estabelecida!')
    console.log('📊 Entidades encontradas:', AppDataSource.entityMetadatas.map(e => e.name))
    await AppDataSource.destroy()
  } catch (error) {
    console.error('❌ Erro na conexão:', error)
  }
}

testConnection()