
import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router'
import { api } from '../src/lib/api';
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { useFonts } from 'expo-font';

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/8f27c945cb446f5d2945',
};

export default function App() {
  const router = useRouter()
  
  const [,response, singInWithGitHub] = useAuthRequest(
    {
      clientId: '8f27c945cb446f5d2945',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'NLWspacetime'
      }),
    },
    discovery
  );

  async function handleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }
  
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      //console.log(code)
      handleGithubOAuthCode(code)
    }
  }, [response]);

  return (
    <View className='flex-1 items-center px-8 py-10'>
    
      <View className='flex-1 items-center justify-center gap-6'>

        <NLWLogo />

        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo
          </Text>

          <Text className='text-center font-bold text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className='rounded-full bg-green-500 px-5 py-2'
          onPress={() => singInWithGitHub()}>
          <Text className='font-alt text-sm uppercase text-black'>Cadastrar lembraca</Text>
        </TouchableOpacity>
      </View>

      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'>
        Feito com 💜 no NLW da Rocketseat
      </Text>

      
    </View>
  );
}

